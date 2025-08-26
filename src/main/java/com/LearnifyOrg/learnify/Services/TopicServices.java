package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.TopicContent;
import com.LearnifyOrg.learnify.Repository.TopicRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Base64;
import java.util.UUID;

@Service
public class TopicServices {

    @Autowired
    private TopicRepository topicRepository;


    private static final String UPLOAD_DIR = "src/main/resources/uploads/";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public TopicContent insertdata(TopicContent topicContent) {
        try {
            String contentJson = topicContent.getContent();

            JsonNode root = objectMapper.readTree(contentJson);

            if (root.has("ops") && root.get("ops").isArray()) {
                for (JsonNode op : root.get("ops")) {
                    if (op.has("insert")) {
                        JsonNode insertNode = op.get("insert");


                        if (insertNode.isObject() && insertNode.has("image")) {
                            String base64Data = insertNode.get("image").asText();
                            if (base64Data != null && base64Data.startsWith("data:image/")) {

                                String extension = getExtension(base64Data);
                                String uniqueName = UUID.randomUUID() + "." + extension;

                                String encodedPart = base64Data.substring(base64Data.indexOf(",") + 1);
                                byte[] imageBytes = Base64.getDecoder().decode(encodedPart);


                                File uploadDir = new File(UPLOAD_DIR);
                                if (!uploadDir.exists()) {
                                    uploadDir.mkdirs();
                                }

                                // save image file
                                File outputFile = new File(UPLOAD_DIR + uniqueName);
                                try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                                    fos.write(imageBytes);
                                }

                                // replace base64 with served path (adjust if you serve differently)
                                ((ObjectNode) insertNode).put("image", "/uploads/" + uniqueName);
                            }
                        }
                    }
                }
            }

            // Save modified JSON back into entity
            String updatedJson = objectMapper.writeValueAsString(root);
            topicContent.setContent(updatedJson);

            // Persist to DB (use your repository)
            return topicRepository.save(topicContent);

        } catch (Exception e) {
            throw new RuntimeException("Error processing content", e);
        }
    }

    private String getExtension(String base64) {
        if (base64.startsWith("data:image/png")) return "png";
        if (base64.startsWith("data:image/jpeg")) return "jpg";
        if (base64.startsWith("data:image/jpg")) return "jpg";
        if (base64.startsWith("data:image/gif")) return "gif";
        if (base64.startsWith("data:image/webp")) return "webp";
        return "png";
    }
}
